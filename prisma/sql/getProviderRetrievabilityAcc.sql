select
    100*ceil(avg_retrievability_success_rate *20)/20 - 5 as "valueFromExclusive",
    100*ceil(avg_retrievability_success_rate *20)/20     as "valueToInclusive",
    count(*)::int                     as "count",
    week
from providers_weekly_acc
group by 1, 2,4
order by 1;
