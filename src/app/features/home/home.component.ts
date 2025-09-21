import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Home component that serves as the landing page for the Angular Reactive Forms Showcase.
 * Provides an overview of the features and patterns demonstrated in the application.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-content">
      <section class="hero">
        <h2>🚀 Features Showcase</h2>
        <p class="hero-description">
          Explore advanced Angular reactive forms patterns and best practices through interactive examples.
        </p>
      </section>

      <section class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Type-Safe Forms</h3>
          <p>Strongly typed reactive forms with custom interfaces and validation</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Custom Validators</h3>
          <p>Reusable validators with typed error messages and internationalization support</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔧</div>
          <h3>Service Architecture</h3>
          <p>Centralized form management with observable state and error handling</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Custom Controls</h3>
          <p>Control Value Accessor implementation for seamless form integration</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Route Guards</h3>
          <p>Prevent navigation with unsaved changes using form dirty state</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>Formatting Pipes</h3>
          <p>Real-time formatting for phone numbers, currency, and postal codes</p>
        </div>
      </section>

      <section class="demo-section">
        <h2>Ready to Explore?</h2>
        <p>Try the interactive form demo to see all these patterns in action.</p>
        <a routerLink="/form" class="demo-button">
          🎯 Launch Form Demo
        </a>
      </section>

      <section class="patterns-section">
        <h2>📚 Patterns Demonstrated</h2>
        <div class="patterns-list">
          <div class="pattern-item">
            <h4>Reactive Forms Architecture</h4>
            <p>FormBuilder, FormGroups, and FormControls with proper typing</p>
          </div>
          <div class="pattern-item">
            <h4>Error Management System</h4>
            <p>Centralized error collection with typed validation messages</p>
          </div>
          <div class="pattern-item">
            <h4>Component Communication</h4>
            <p>Parent-child form communication with nested form groups</p>
          </div>
          <div class="pattern-item">
            <h4>State Management</h4>
            <p>Form state tracking with signals and observables</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-content {
      max-width: 1000px;
      margin: 0 auto;
    }

    .hero {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .hero-description {
      font-size: 1.2rem;
      margin: 0;
      opacity: 0.9;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      border: 1px solid #e9ecef;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.3rem;
    }

    .feature-card p {
      color: #6c757d;
      line-height: 1.5;
      margin: 0;
    }

    .demo-section {
      text-align: center;
      padding: 3rem 2rem;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .demo-section h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .demo-section p {
      color: #6c757d;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .demo-button {
      display: inline-block;
      background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
      color: white;
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
    }

    .patterns-section {
      margin-bottom: 2rem;
    }

    .patterns-section h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    .patterns-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .pattern-item {
      background: white;
      padding: 1.5rem;
      border-left: 4px solid #667eea;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .pattern-item h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .pattern-item p {
      color: #6c757d;
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class HomeComponent {}