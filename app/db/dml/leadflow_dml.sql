SET SCHEMA 'leadflow';
DROP PROCEDURE IF EXISTS add_lead;
DROP PROCEDURE IF EXISTS add_lead_analysis;
DROP PROCEDURE IF EXISTS update_analysis_status;
DROP FUNCTION IF EXISTS get_pending_leads;
DROP FUNCTION IF EXISTS get_pending_leads_id;
DROP FUNCTION IF EXISTS get_leads_with_analysis;
DROP FUNCTION IF EXISTS get_lead_by_id;



CREATE PROCEDURE add_lead(fname TEXT, lname TEXT, email TEXT, company TEXT, message TEXT, source TEXT)
LANGUAGE plpgsql 
AS $$
BEGIN 
    INSERT INTO LEADS (lead_id, fname, lname, email, company, message, source, created_at, analysis_status)
        VALUES (DEFAULT, fname, lname, email, company, message, source, DEFAULT, DEFAULT);
END; 
$$;

CREATE PROCEDURE add_lead_analysis(lead_id INTEGER, summary TEXT, category TEXT, urgency TEXT, sentiment TEXT, suggested_reply TEXT, next_action TEXT, raw_json JSONB)
LANGUAGE plpgsql 
AS $$
BEGIN 
    INSERT INTO LEADS_ANALYSIS (analysis_id, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, created_at)
        VALUES (DEFAULT, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, DEFAULT);
END; 
$$;

CREATE PROCEDURE update_analysis_status(p_lead_ids INTEGER[])
LANGUAGE plpgsql 
AS $$
BEGIN 
    UPDATE LEADS AS L
    SET analysis_status = 'Complete'
    WHERE L.lead_id = ANY(p_lead_ids);
END; 
$$;

CREATE FUNCTION get_pending_leads()
RETURNS SETOF LEADS 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get all leads
    RETURN QUERY
    SELECT *
    FROM LEADS AS L
    WHERE L.analysis_status = 'Pending'
    ORDER BY L.created_at ASC;
END;
$$;

CREATE FUNCTION get_pending_leads_id(p_lead_id INTEGER)
RETURNS SETOF LEADS 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get all leads
    RETURN QUERY
    SELECT *
    FROM LEADS AS L
    WHERE L.analysis_status = 'Pending' AND L.lead_id = p_lead_id;
END;
$$;

CREATE FUNCTION get_leads_with_analysis()
RETURNS TABLE (
    lead_id INTEGER,
    fname TEXT,
    lname TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    source TEXT,
    created_at TIMESTAMP,
    analysis_status status_dom,
    summary TEXT,
    category TEXT,
    urgency TEXT,
    sentiment TEXT,
    suggested_reply TEXT,
    next_action TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Left join with analysis fields
    RETURN QUERY
    SELECT 
        L.lead_id,
        L.fname,
        L.lname,
        L.email,
        L.company,
        L.message,
        L.source,
        L.created_at,
        L.analysis_status,
        LA.summary,
        LA.category,
        LA.urgency,
        LA.sentiment,
        LA.suggested_reply,
        LA.next_action
    FROM LEADS AS L
    LEFT JOIN LEADS_ANALYSIS AS LA
        ON L.lead_id = LA.lead_id
    ORDER BY L.created_at ASC;
END;
$$;

CREATE FUNCTION get_lead_by_id(p_lead_id INTEGER)
RETURNS TABLE (
    lead_id INTEGER,
    fname TEXT,
    lname TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    source TEXT,
    created_at TIMESTAMP,
    analysis_status status_dom,
    summary TEXT,
    category TEXT,
    urgency TEXT,
    sentiment TEXT,
    suggested_reply TEXT,
    next_action TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        L.lead_id,
        L.fname,
        L.lname,
        L.email,
        L.company,
        L.message,
        L.source,
        L.created_at,
        L.analysis_status,
        LA.summary,
        LA.category,
        LA.urgency,
        LA.sentiment,
        LA.suggested_reply,
        LA.next_action
    FROM LEADS AS L
    LEFT JOIN LEADS_ANALYSIS AS LA 
        ON L.lead_id = LA.lead_id
    WHERE L.lead_id = p_lead_id;
END;
$$;