import React from "react";
import * as loglevel from "loglevel";
import { Switch, Route, withRouter } from 'react-router-dom';

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import VolunteerList from "./VolunteerList";
import sitcAirtable from "../../api/sitcAirtable";

class MainView extends React.Component {
    constructor () {
        super();

        this.setOnSiteHandler = this.setOnSiteHandler.bind(this);
    }

    componentDidMount () {
        let projectSite_init = "";

        loglevel.log("ProjectSitesMainView did mount.");

        if (!localStorage.getItem('defaultProjectSiteId')) {
            this.props.history.push("/siteSelect/project");
        } else {
            const siteId = localStorage.getItem('defaultProjectSiteId');
            this.props.setProjectSiteId(siteId);
            projectSite_init = siteId;

            let self = this;

            sitcAirtable.getProjectSites().then((sites) => this.props.updateProjectSites(sites));

            sitcAirtable.getCarpoolSites().then((sites) => this.props.updateCarpoolSites(sites));

            sitcAirtable.getAttendanceRecordsToday()
                .then((info) => this.props.updateAttendanceRecs(info))
                .then(() => sitcAirtable.getProfiles(
                    Object.values(this.props.attendanceRecs).map((recInfo) => recInfo["Volunteer ID"][0])
                ))
                .then((teerInfo) => {
                    loglevel.info("teerInfo");
                    loglevel.info(teerInfo);

                    const onSiteTeers = {};
                    const notOnSiteTeers = {};
                    
                    Object.keys(this.props.attendanceRecs).forEach((attendanceRecId) => {
                        const attendanceRec = this.props.attendanceRecs[attendanceRecId];
                        const personId = attendanceRec["Volunteer ID"]
                        teerInfo[personId]["attendanceRecId"] = attendanceRecId;
                        teerInfo[personId]["checkedInAtCarpoolSite"] = attendanceRec["Carpool Site"];

                        if (attendanceRec["On Site"]) {
                            onSiteTeers[attendanceRecId] = {
                                personId: personId
                            }
                        } else {
                            notOnSiteTeers[attendanceRecId] = {
                                personId: personId
                            }
                        }

                    })

                    this.props.updateVolunteerInfo(teerInfo);
                    this.props.updateOnSiteTeers(onSiteTeers);
                    this.props.updateNotOnSiteTeers(notOnSiteTeers);
                });
        }
    }

    setOnSiteHandler (personId) {
        const attendanceRecId = teerInfo[personId].attendanceRecId;
        sitcAirtable.setOnSiteStatus(attendanceRecId, true)
            .then((record) => {
                const updatedOnSiteTeers = {
                    ...this.props.onSiteTeers
                };
                updatedOnSiteTeers[attendanceRecId] = {
                    personId: personId,
                }
                this.props.updateOnSiteTeers(updatedOnSiteTeers);

                // have to slice because we need to assign a copy of the original, not a reference to it
                const updatedNotOnSiteTeers = { ...this.props.notOnSiteTeers };
                delete updatedNotOnSiteTeers[attendanceRecId];
                this.props.updateNotOnSiteTeers(updatedNotOnSiteTeers);
            });
    }

    render () {
        return (
            <React.Fragment>
                <Tabs
                    value={this.props.activeTab}
                    onChange={this.handleTabChange}
                    variant="fullWidth"
                >
                    <Tab label="Registered" />
                    <Tab label="Checked In" />
                </Tabs>
                <Switch>
                    <Route exact path="/project" render={routeProps => (
                        <VolunteerList
                            {...routeProps}
                            setOnSiteHandler={this.setOnSiteHandler}
                            volunteerInfo={this.props.volunteerInfo}
                            onSiteTeers={this.props.onSiteTeers}
                            notOnSiteTeers={this.props.notOnSiteTeers}
                            headsUpTeers={this.props.headsUpTeers}
                            carpoolSites={this.props.carpoolSites}
                            filteredTeers={this.props.filteredTeers}
                        />
                    )} />
                    {/* <Route path="/project/onSite" render={routeProps => (
                        <OnSiteList
                            {...routeProps}
                            checkOutHandler={this.checkOutHandler}
                            volunteerInfo={this.props.volunteerInfo}
                            onSiteTeers={this.props.onSiteTeers}
                            setTabIndex={this.setTabIndex}
                            filteredTeers={this.props.filteredTeers}
                        />
                    )}/> */}
                </Switch>
            </React.Fragment>
        );
    }


}

export default withRouter(MainView);
