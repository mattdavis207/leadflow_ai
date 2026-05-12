SET SCHEMA 'leadflow';


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
    INSERT INTO LEADS (analysis_id, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, created_at)
        VALUES (DEFAULT, lead_id, summary, category, urgency, sentiment, suggested_reply, next_action, raw_json, DEFAULT);
END; 
$$;

CREATE FUNCTION get_leads()
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
RETURNS SETOF LEADS 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM LEADS
    WHERE LEADS.lead_id = p_lead_id;
END;
$$;