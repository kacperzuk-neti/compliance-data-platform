with clients_per_provider as (select count(distinct client) as clients_count,
                                     week
                              from client_provider_distribution_weekly_acc
                              group by provider, week)
select (clients_count - 1)::float as "valueFromExclusive",
       clients_count::float       as "valueToInclusive",
       week                       as "week",
       count(*)::int as "count"
from clients_per_provider
group by 1, 2, 3
order by 3, 1;
