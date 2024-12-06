import { SafeMarkdown, styled, t } from '@superset-ui/core';
import Handlebars from 'handlebars';
import React, { useMemo, useState, useEffect } from 'react';
import { initializeCustomHelpers } from './helpers';

// Define the props interface for type safety
export interface HandlebarsViewerProps {
  templateSource: string;  // The Handlebars template source
  data: any;              // Data to be used in template rendering
}

export const HandlebarsViewer = ({
  templateSource,
  data,
}: HandlebarsViewerProps) => {
  // State management for the component
  const [renderedTemplate, setRenderedTemplate] = useState('');
  const [error, setError] = useState('');
  const [helpersInitialized, setHelpersInitialized] = useState(false);

  // Get configuration from the application container
  const appContainer = document.getElementById('app');
  const { common } = JSON.parse(
    appContainer?.getAttribute('data-bootstrap') || '{}',
  );

  // Extract sanitization settings from configuration
  const htmlSanitization = common?.conf?.HTML_SANITIZATION ?? true;
  const htmlSchemaOverrides = common?.conf?.HTML_SANITIZATION_SCHEMA_EXTENSIONS || {};

  // Initialize helpers when component mounts
  useEffect(() => {
    const initialized = initializeCustomHelpers();
    setHelpersInitialized(initialized);

    // We don't need a cleanup function since Handlebars helpers
    // are registered globally and persist through the application lifecycle
  }, []);

  // Compile and render template when dependencies change
  useMemo(() => {
    // Don't attempt to render until helpers are initialized
    if (!helpersInitialized) return;

    try {
      // Compile the template with Handlebars
      const template = Handlebars.compile(templateSource);
      
      // Render the template with provided data
      const result = template(data);
      
      // Update component state with successful render
      setRenderedTemplate(result);
      setError('');
    } catch (error: any) {
      // Handle any errors during template compilation or rendering
      setRenderedTemplate('');
      setError(error.message || 'An error occurred while rendering the template');
    }
  }, [templateSource, data, helpersInitialized]);

  // Styled component for error display
  const Error = styled.pre`
    white-space: pre-wrap;
    color: red;
    padding: 1em;
    border: 1px solid #ffcdd2;
    border-radius: 4px;
    background-color: #ffebee;
  `;

  // Error state rendering
  if (error) {
    return <Error>{error}</Error>;
  }

  // Loading state rendering
  if (!helpersInitialized || !renderedTemplate) {
    return <p>{t('Loading...')}</p>;
  }

  // Successful render with sanitization
  return (
    <SafeMarkdown
      source={renderedTemplate}
      htmlSanitization={htmlSanitization}
      htmlSchemaOverrides={htmlSchemaOverrides}
    />
  );
};