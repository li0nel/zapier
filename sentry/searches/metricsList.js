SENTRY_DOMAIN = process.env.SENTRY_DOMAIN || 'sentry.io'

const getProjects = (z, bundle) => {
    const promise = z.request({
        method: 'GET',
        url: `https://${SENTRY_DOMAIN}/api/0/projects/`,
    });

    return promise.then(response => {
        let projects = JSON.parse(response.content)

        return projects.map(
            p => ({
                name: p.name,
                org_slug: p.organization.slug,
                slug: p.slug
            })
        )
    })
}

const metricsList = (z, bundle) => {
    let projects = getProjects(z, bundle);
    let project_names = [];
    
    let promises = projects.map(p => {
        project_names.push(p.name)
        return z.request({
            method: 'GET',
            url: `https://${SENTRY_DOMAIN}/api/0/projects/${p.org_slug}/${p.slug}/issues/`
        })
    })
  
    return Promise.all(promises).then(responses => {
        return responses.map((r, index) => {
            let issues = JSON.parse(r.content)
            return {
                project: project_names[index].name,
                nb_unresolved_issues: issues.length
            }
        })
    })
}
  
module.exports = {
    key: 'metrics',
    noun: 'Metrics',

    display: {
        label: 'List Metrics',
        description: 'List Metrics in Sentry.',
    },

    operation: {
        inputFields: [
            { key: 'dummy', required: false, type: 'string' },
        ],

        perform: metricsList,

        sample: {
            project: 'test',
            nb_unresolved_issues: 345
        }
    }
};
  