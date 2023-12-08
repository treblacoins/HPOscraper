function beautifyScrapeResult(alertsList) {
    let beautifiedAlerts = '';
    alertsList.forEach((alert, i) => {
        beautifiedAlerts += 'PROMOCIO ' + (++i) + ' -- ' + alert.date + '\n' + alert.description + '\n\n';
    });
    return beautifiedAlerts;
}

module.exports = { beautifyScrapeResult };