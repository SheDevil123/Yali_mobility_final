-- Add notes column to personas table
ALTER TABLE personas ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE personas ADD COLUMN IF NOT EXISTS field TEXT;

-- Create basic_info table
CREATE TABLE IF NOT EXISTS basic_info (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
    role TEXT,
    department TEXT,
    joining_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(persona_id)
);

-- Create additional_details table
CREATE TABLE IF NOT EXISTS additional_details (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
    skills TEXT[],
    certifications TEXT[],
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(persona_id)
);

-- Create timeline table
CREATE TABLE IF NOT EXISTS timeline (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    event TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_basic_info_persona_id ON basic_info(persona_id);
CREATE INDEX IF NOT EXISTS idx_additional_details_persona_id ON additional_details(persona_id);
CREATE INDEX IF NOT EXISTS idx_timeline_persona_id ON timeline(persona_id);
CREATE INDEX IF NOT EXISTS idx_documents_persona_id ON documents(persona_id); 