with clients_per_provider as (select count(distinct client) as clients_count,
                                     week
                              from client_provider_distribution_weekly
                              group by provider, week)
select (clients_count - 1)::float as "value_from_exclusive",
       clients_count::float       as "value_to_inclusive",
       week                       as "week",
       count(*)::int as "count"
from clients_per_provider
group by 1, 2, 3
order by 3, 1;
