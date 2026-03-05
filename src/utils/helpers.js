export const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

export const calculateDashboardMetrics = (properties) => {
    let portfolioValue = 0;
    let monthlyRent = 0;
    let monthlyMortgage = 0;

    properties.forEach(p => {
        portfolioValue += Number(p.purchasePrice || 0);
        monthlyRent += Number(p.monthlyRent || 0);
        monthlyMortgage += Number(p.monthlyMortgage || 0);
    });

    return {
        portfolioValue,
        monthlyRent,
        monthlyMortgage,
        propertyCount: properties.length
    };
};
