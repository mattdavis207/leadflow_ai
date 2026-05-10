SET SCHEMA 'leadflow';


CREATE PROCEDURE add_lead(name TEXT, email TEXT, company TEXT, message TEXT, source TEXT)
LANGUAGE plpgsql 
AS $$
BEGIN 
    INSERT INTO LEADS (lead_id, name, email, company, message, source, created_at)
        VALUES (DEFAULT, name, email, company, message, source, DEFAULT);
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