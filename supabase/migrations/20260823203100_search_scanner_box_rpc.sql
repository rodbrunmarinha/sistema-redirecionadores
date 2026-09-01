
CREATE OR REPLACE FUNCTION search_scanner_box(p_tenant_id uuid, p_search text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT row_to_json(t) INTO result
  FROM (
    SELECT b.id, b.tracking_number as tracking_code, b.store_name, l.code as warehouse_location_code
    FROM boxes b
    LEFT JOIN warehouse_locations l ON b.location_id = l.id
    WHERE b.tenant_id = p_tenant_id
      AND b.status = 'RECEIVED'
      AND b.deleted_at IS NULL
      AND (
        b.tracking_number = p_search
        OR b.id::text ILIKE ltrim(p_search, '#') || '%'
      )
    LIMIT 1
  ) t;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

GRANT EXECUTE ON FUNCTION search_scanner_box(uuid, text) TO authenticated, service_role;
