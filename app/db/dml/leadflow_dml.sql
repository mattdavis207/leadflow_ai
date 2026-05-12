SET SCHEMA 'leadflow';


CREATE PROCEDURE add_lead(fname TEXT, lname TEXT, email TEXT, company TEXT, message TEXT, source TEXT)
LANGUAGE plpgsql 
AS $$
BEGIN 
    INSERT INTO LEADS (lead_id, fname, lname, email, company, message, source, created_at)
        VALUES (DEFAULT, fname, lname, email, company, message, source, DEFAULT);
END; 
$$;

CREATE PROCEDURE add_lead_analysis(lead_id INTEGER, summary TEXT, category TEXT, urgency TEXT, sentiment TEXT, suggested_reply TEXT, next_action TEXT, raw_json JSONB)
LANGUAGE plpgsql 
AS $$
BEGIN 
    INSERT INTO LEADS (analysis_id, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, created_at)
        VALUES (DEFAULT, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, DEFAULT);
END; 
$$;

CREATE FUNCTION get_leads()
RETURNS SETOF LEADS 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM LEADS
    ORDER BY created_at ASC;
END;
$$;

CREATE FUNCTION get_lead_by_id(lead_id INTEGER)
RETURNS SETOF LEADS 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM LEADS
    WHERE lead_id = get_lead_by_id.lead_id;
END;
$$;