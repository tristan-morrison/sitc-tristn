import React from "react";
import * as loglevel from "loglevel";
import { Switch, Route, withRouter } from 'react-router-dom';


import sitcAirtable from "../../api/sitcAirtable";

class MainView extends React.Component {
    constructor () {
        super();
    }

    componentDidMount () {
        let projectSite_init = "";

        loglevel.log("ProjectSitesMainView did mount.");

        if (!localStorage.getItem('defaultProjectSite')) {
            this.props.history.push("/siteSelect/project");
        } else {
            const siteId = localStorage.getItem('defaultProjectSite');
            this.props.setProjectSiteId(siteId);
            projectSite_init = siteId;

            let self = this;

            const projectSitesPromise = sitcAirtable.getProjectSites();
            projectSitesPromise.then(siteInfo => {
                loglevel.info(siteInfo);
                this.setState({
                    projectSites: siteInfo
                });
            })

            sitcAirtable.getProjectSites()
                .then((sites) => this.props.updateProjectSites(sites))
                .then(() => sitcAirtable.getAttendanceRecordsToday(null, projectSite_init))
                .then((info) => this.props.updateCheckedInTeers(info))
                .then(() => sitcAirtable.getProfiles())
                .then((teerInfo) => {
                    loglevel.info("teerInfo");
                    loglevel.info(teerInfo);
                    this.props.updateVolunteerInfo(teerInfo)
                });
        }
    }

    render () {
        return (
            <div>Hello, world!</div>
        );
    }


}

export default withRouter(MainView);
