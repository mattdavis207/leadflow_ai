DROP SCHEMA IF EXISTS leadflow CASCADE;
CREATE SCHEMA leadflow;
SET SCHEMA 'leadflow';


CREATE TABLE LEADS (
    lead_id SERIAL,
    fname TEXT,
    lname TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT lead_pk PRIMARY KEY(lead_id)
);

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
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT leads_analysis_pk PRIMARY KEY(analysis_id),
    CONSTRAINT leads_analysis_fk FOREIGN KEY(lead_id) REFERENCES LEADS(lead_id)
        ON DELETE CASCADE
);