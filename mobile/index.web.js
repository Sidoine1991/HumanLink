// Import polyfills first for web compatibility
import './polyfills';

// Import gesture handler for react-navigation (required)
// On web, this is handled by react-native-web
try {
  require('react-native-gesture-handler');
} catch (e) {
  console.warn('⚠️ react-native-gesture-handler not available on web, continuing...');
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('🚀 Starting HumanLink app...');

// Error boundary pour capturer les erreurs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          color: 'red',
          fontFamily: 'monospace',
          backgroundColor: '#fff',
        }
      }, [
        React.createElement('h1', { key: 'title' }, 'Erreur de rendu'),
        React.createElement('pre', { key: 'error', style: { whiteSpace: 'pre-wrap' } }, 
          this.state.error?.toString() || 'Unknown error'
        ),
        this.state.errorInfo && React.createElement('pre', { 
          key: 'stack', 
          style: { whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' } 
        }, this.state.errorInfo.componentStack),
      ]);
    }
    return this.props.children;
  }
}

// Start the app with ReactDOM
(function() {
  try {
    console.log('🔍 Recherche de l\'élément root...');
    const rootElement = document.getElementById('root');
    console.log('🔍 Root element:', rootElement);
    
    if (!rootElement) {
      console.error('❌ Root element not found!');
      document.body.innerHTML = '<div style="padding: 20px; color: red; background: white;">Root element not found!</div>';
      return;
    }
    
    console.log('✅ Root element found, creating React root...');
    
    // Ne pas effacer le contenu immédiatement - React le remplacera
    // Mais s'assurer que le conteneur est prêt
    const root = createRoot(rootElement);
    console.log('✅ React root created, rendering app...');
    
    // Rendre directement l'application avec ErrorBoundary
    root.render(
      React.createElement(ErrorBoundary, null, React.createElement(App))
    );
    console.log('✅ Application rendered successfully');
    
  } catch (error) {
    console.error('❌ Error starting application:', error);
    console.error('❌ Error stack:', error.stack);
    const rootTag = document.getElementById('root');
    if (rootTag) {
      rootTag.innerHTML = `
        <div style="padding: 20px; color: red; font-family: monospace; background: white; min-height: 100vh;">
          <h1>Erreur au démarrage</h1>
          <pre style="white-space: pre-wrap;">${error.toString()}</pre>
          <pre style="font-size: 12px; white-space: pre-wrap;">${error.stack}</pre>
        </div>
      `;
    } else {
      document.body.innerHTML = `
        <div style="padding: 20px; color: red; font-family: monospace; background: white;">
          <h1>Erreur critique</h1>
          <p>Root element not found and error occurred:</p>
          <pre>${error.toString()}</pre>
        </div>
      `;
    }
  }
})();

