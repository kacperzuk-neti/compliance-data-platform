select
    client,
    hour,
    sum(total_deal_size)::bigint as total_deal_size
from unified_verified_deal_hourly
group by
    client,
    hour;