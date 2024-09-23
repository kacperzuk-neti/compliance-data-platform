select
    date_trunc('hour', to_timestamp("termStart" * 30 + 1598306400)) as hour,
    'f0' || "clientId"  as client,
    'f0' || "providerId"  as provider,
    count(*)::int as num_of_claims,
    sum("pieceSize")::bigint as total_deal_size
from unified_verified_deal
where
    "termStart" >= 3847920 -- nv22 start
    and to_timestamp("termStart" * 30 + 1598306400) <= current_timestamp -- deals that didn't start yet
group by
    hour,
    client,
    provider;