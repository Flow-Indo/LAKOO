package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	dbURL, err := resolveSellerDBURL()
	if err != nil {
		fatal(err)
	}

	dbURL, err = sanitizeNeonURL(dbURL)
	if err != nil {
		fatal(err)
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fatal(err)
	}
	defer db.Close()

	if err := db.PingContext(ctx); err != nil {
		fatal(fmt.Errorf("db ping failed: %w", err))
	}

	rows, err := db.QueryContext(ctx, `
		select table_name
		from information_schema.tables
		where table_schema = 'public'
		  and table_type = 'BASE TABLE'
		order by table_name
	`)
	if err != nil {
		fatal(err)
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var n string
		if err := rows.Scan(&n); err != nil {
			fatal(err)
		}
		names = append(names, n)
	}
	if err := rows.Err(); err != nil {
		fatal(err)
	}

	sort.Strings(names)
	for _, n := range names {
		fmt.Println(n)
	}
}

func resolveSellerDBURL() (string, error) {
	if v := strings.TrimSpace(os.Getenv("SELLER_DATABASE_URL")); v != "" {
		return v, nil
	}

	dbConnPath, err := findFileUpwards("DB_Connection.txt", 6)
	if err != nil {
		return "", err
	}

	b, err := os.ReadFile(dbConnPath)
	if err != nil {
		return "", fmt.Errorf("read DB_Connection.txt: %w", err)
	}

	re := regexp.MustCompile(`psql\s+'([^']+/seller_db\?[^']*)'`)
	m := re.FindStringSubmatch(string(b))
	if len(m) != 2 {
		return "", errors.New("seller_db connection not found; set SELLER_DATABASE_URL or add seller_db to DB_Connection.txt")
	}
	return m[1], nil
}

func sanitizeNeonURL(raw string) (string, error) {
	u, err := url.Parse(raw)
	if err != nil {
		return "", fmt.Errorf("parse url: %w", err)
	}
	q := u.Query()
	q.Del("channel_binding")
	u.RawQuery = q.Encode()
	return u.String(), nil
}

func findFileUpwards(rel string, maxLevels int) (string, error) {
	start, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("getwd: %w", err)
	}

	cur := start
	for i := 0; i <= maxLevels; i++ {
		p := filepath.Join(cur, filepath.FromSlash(rel))
		if _, err := os.Stat(p); err == nil {
			return p, nil
		}
		parent := filepath.Dir(cur)
		if parent == cur {
			break
		}
		cur = parent
	}

	return "", fmt.Errorf("file not found: %s (searched %d levels up from %s)", rel, maxLevels, start)
}

func fatal(err error) {
	_, _ = fmt.Fprintln(os.Stderr, "error:", err)
	os.Exit(1)
}

