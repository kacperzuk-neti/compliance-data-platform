with provider_retrievability_weekly as (
    select
        date_trunc('week', date) as week,
        provider,
        sum(total) as total,
        sum(successful) as successful,
        sum(successful::float8)/sum(total::float8) as success_rate
    from provider_retrievability_daily
    group by
        week,
        provider
)
select  
    week,
    provider,
    count(*)::int as num_of_clients,
    max(total_deal_size)::bigint as biggest_client_total_deal_size,
    sum(total_deal_size)::bigint as total_deal_size,
    max(coalesce(success_rate, 0)) as avg_retrievability_success_rate
from client_provider_distribution_weekly
left join provider_retrievability_weekly
    using (week, provider)
group by
    week,
    provider;