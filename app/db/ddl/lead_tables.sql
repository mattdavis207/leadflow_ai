CREATE SCHEMA leadflow;
DROP SCHEMA IF EXISTS 'leadflow';
DROP TABLE IF EXISTS LEADS;
DROP TABLE IF EXISTS LEADS_ANALYSIS; 


CREATE TABLE LEADS (
    lead_id SERIAL,
    name TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT lead_pk AS PRIMARY KEY(lead_id)
)

CREATE TABLE LEADS_ANALYSIS(
    analysis_id SERIAL,
    lead_id INTEGER,
    summary TEXT,
    category TEXT,
    urgency TEXT,
    sentiment TEXT,
    suggested_reply TEXT,
    next_action TEXT,
    raw_json JSONB,
    created_at TIMESTAMP DEFAULT NOW()
)