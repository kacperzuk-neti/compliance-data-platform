select
    100*ceil(success_rate *20)/20 - 5 as "valueFromExclusive",
    100*ceil(success_rate *20)/20     as "valueToInclusive",
    count(*)::int                     as "count",
    date_trunc('week', date)          as "week"
from provider_retrievability_daily
group by 1, 2,4
order by 1;
