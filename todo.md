# Backend Implementation TODO - CrisisVision AI

## Progress

- [x] 1. Analyze codebase & form plan
- [ ] 2. Add `notifications` & `weatherReports` tables to schema
- [ ] 3. Add notification/weather/admin CRUD DB functions to `server/db.ts`
- [ ] 4. Create `server/routers/ai.ts` (AI chat)
- [ ] 5. Create `server/routers/predictor.ts` (severity predictor)
- [ ] 6. Create `server/routers/notifications.ts`
- [ ] 7. Create `server/routers/weather.ts`
- [ ] 8. Add admin CRUD mutations for events/shelters/resources
- [ ] 9. Register all routers in `server/routers.ts`
- [ ] 10. Add migration file for new tables
- [ ] 11. Update `drizzle/seed.ts` with sample data
- [ ] 12. Wire AIAssistant to `trpc.ai.chat`
- [ ] 13. Wire SeverityPredictor to `trpc.predictor.assess`
- [ ] 14. Wire NotificationsDropdown to `trpc.notifications.*`
- [ ] 15. Wire WeatherIntel to `trpc.weather.*`
- [ ] 16. Run `pnpm check` to verify TypeScript compiles
