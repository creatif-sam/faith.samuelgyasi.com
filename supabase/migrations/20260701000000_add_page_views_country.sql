-- Adds visitor country tracking to page_views for the admin "Visitors by Location" map.
alter table page_views
  add column if not exists country text;

create index if not exists page_views_country_idx on page_views (country);
