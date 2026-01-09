package types

import (
	"encoding/json"
	"errors"
)

type JSONB map[string]interface{}

func (j *JSONB) Scan(value interface{}) error { //json to map[string]interface{}, gorm calls this method when retrieving from db
	if value == nil {
		*j = nil
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return errors.New("unsupported type for JSONB")
	}
}

func (j JSONB) Value() (interface{}, error) { //map[string]interface{} to json, gorm calls this method when saving to db
	if j == nil {
		return nil, nil
	}

	return json.Marshal(j)
}
