select
    ceil(avg_weighted_retrievability_success_rate*20)*5 - 5 as "valueFromExclusive",
    ceil(avg_weighted_retrievability_success_rate*20)*5 as "valueToInclusive",
    count(*)::int as "count",
    week
from allocators_weekly
group by 1, 2, week
order by week;
