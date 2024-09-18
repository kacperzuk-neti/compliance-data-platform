with providers_with_ratio as (select provider,
                                     max(total_deal_size) / sum(total_deal_size) biggest_to_total_ratio,
                                     week
                              from client_provider_distribution_weekly
                              group by provider, week)
select 100 * ceil(biggest_to_total_ratio::float8 * 20) / 20 - 5 as "value_from_exclusive",
       100 * ceil(biggest_to_total_ratio::float8 * 20) / 20     as "value_to_inclusive",
       count(*)::int as "count",
       week
from providers_with_ratio
group by "value_from_exclusive", "value_to_inclusive", week
order by week, 1;
