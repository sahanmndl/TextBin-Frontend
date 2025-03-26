import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    value: string
    onChange: (value: string) => void
    language?: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({value, onChange, language = "javascript"}) => {
    return (
        <div className="h-full">
            <Editor
                height="66vh"
                language={language}
                defaultLanguage={language}
                defaultValue={"// Write or Paste your code here..."}
                theme="light"
                value={value}
                onChange={(value) => onChange(value || "")}
                options={{
                    minimap: {enabled: false},
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    automaticLayout: true,
                    padding: {top: 16},
                }}
            />
        </div>
    );
};

export default CodeEditor;