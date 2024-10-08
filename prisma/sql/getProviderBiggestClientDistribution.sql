with providers_with_ratio as (select provider,
                                     max(total_deal_size) / sum(total_deal_size) biggest_to_total_ratio,
                                     week
                              from client_provider_distribution_weekly
                              group by provider, week)
select 100 * ceil(biggest_to_total_ratio::float8 * 20) / 20 - 5 as "valueFromExclusive",
       100 * ceil(biggest_to_total_ratio::float8 * 20) / 20     as "valueToInclusive",
       count(*)::int as "count",
       week
from providers_with_ratio
group by "valueFromExclusive", "valueToInclusive", week
order by week, 1;
