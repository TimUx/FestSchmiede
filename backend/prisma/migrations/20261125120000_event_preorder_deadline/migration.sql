-- Optionaler Stichtag für Online-Vorbestellungen pro Veranstaltung.
ALTER TABLE "Event"
  ADD COLUMN "preorder_deadline" TIMESTAMP(3),
  ADD COLUMN "online_orders_on_event_day" BOOLEAN NOT NULL DEFAULT false;
