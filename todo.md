# Project TODO

## Core Features
- [x] Landing page with hero section, feature highlights, and CTA
- [x] Dashboard with real-time KPI cards (active disasters, severity index, affected population, resource utilization)
- [x] Interactive disaster map (using built-in Map component with mock data)
- [x] Live alert feed panel (severity badges, event type icons, timestamps, location, urgency scores, sortable/filterable)
- [x] Disaster event database schema (events, shelters, resources) and tRPC API
- [x] Weather intelligence panel (current conditions, OpenWeatherMap mock data, Recharts visualizations)
- [x] Resource allocation tracker (table view, status indicators, assignment tracking)
- [x] AI Chat Assistant (using built-in AIChatBox component, disaster response expert)
- [x] Severity prediction module (form for disaster parameters, AI-generated score, recommended actions via LLM)
- [x] Responsive DashboardLayout with sidebar navigation (Overview, Live Map, Alert Feed, Weather Intel, Resources, AI Assistant, Severity Predictor)
- [x] Auth-gated access for all dashboard sections
- [x] Push instant in-app and email notifications to platform owner for high-severity events or critical thresholds (ready for integration)
- [x] Background cron job (hourly) to simulate ingesting new disaster event data and refresh dashboard metrics

## Style Direction
- [x] Dark cyberpunk aesthetic: deep navy/black backgrounds, cyan and red neon accents
- [x] Inter font paired with a monospace font for data-heavy elements

## Constraints & Technical Requirements
- [x] Use tRPC for all API communication
- [x] Use Recharts for all data visualizations in the weather panel
- [x] Use the built-in AIChatBox component for the AI Assistant page
- [x] LLM integration for AI Chat Assistant and Severity Prediction module (mock responses ready)
- [x] Seed data included for all database tables
- [x] Notifications target platform owner specifically
