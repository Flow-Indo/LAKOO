package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"regexp"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
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

	migDir, err := findDirUpwards(filepath.FromSlash("db/migrations"), 6)
	if err != nil {
		// fallback when running from repo root
		migDir, err = findDirUpwards(filepath.FromSlash("backend/services/seller-service/db/migrations"), 6)
	}
	if err != nil {
		fatal(err)
	}

	entries, err := os.ReadDir(migDir)
	if err != nil {
		fatal(fmt.Errorf("read migrations dir: %w", err))
	}

	var files []string
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if strings.HasSuffix(strings.ToLower(e.Name()), ".sql") {
			files = append(files, filepath.Join(migDir, e.Name()))
		}
	}

	sort.Strings(files)
	for _, p := range files {
		b, err := os.ReadFile(p)
		if err != nil {
			fatal(fmt.Errorf("read migration file %s: %w", p, err))
		}
		if _, err := db.ExecContext(ctx, string(b)); err != nil {
			fatal(fmt.Errorf("apply migration %s: %w", filepath.Base(p), err))
		}
		fmt.Println("ok:", filepath.Base(p))
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

	// Matches: psql 'postgresql://.../seller_db?...'
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

	// Some clients (including lib/pq) can choke on unknown params. Prisma uses channel_binding,
	// but lib/pq doesn't require it for Neon connections.
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

func findDirUpwards(rel string, maxLevels int) (string, error) {
	start, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("getwd: %w", err)
	}

	cur := start
	for i := 0; i <= maxLevels; i++ {
		p := filepath.Join(cur, filepath.FromSlash(rel))
		if fi, err := os.Stat(p); err == nil && fi.IsDir() {
			return p, nil
		}
		parent := filepath.Dir(cur)
		if parent == cur {
			break
		}
		cur = parent
	}

	return "", fmt.Errorf("dir not found: %s (searched %d levels up from %s)", rel, maxLevels, start)
}

func fatal(err error) {
	_, _ = fmt.Fprintln(os.Stderr, "error:", err)
	os.Exit(1)
}
