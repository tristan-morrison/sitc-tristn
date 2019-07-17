import React, { useState } from "react";
import { Switch, Route, withRouter } from 'react-router-dom';
import * as loglevel from "loglevel";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from '@material-ui/core/Tab';

import CarpoolSiteSelect from "./CarpoolSiteSelect";
import ProjectSiteSelect from "./projectSite/ProjectSiteSelect";

export default function (props) {
    loglevel.info("Props: ");
    loglevel.info(props);

    const [isOpen, setIsOpen] = useState(true);

    let initialTab = 0;
    if (/project/.test(props.location.pathname)) {
        initialTab = 1;
    }
    const [activeTab, setActiveTab] = useState(initialTab);

    const handleActiveTabChange = (event, value) => {
        setActiveTab(value)
        switch (value) {
            case 0:
                props.history.push('/siteSelect');
                break;
            case 1:
                props.history.push('/siteSelect/project');
        }
    };

    const close = () => {
        setIsOpen(false);
    }

    return (
        <Dialog onClose={close} open={isOpen}>
            <React.Fragment>
                <Tabs
                    value={activeTab}
                    onChange={handleActiveTabChange}
                    variant="fullWidth"
                >
                    <Tab label="Carpool" />
                    <Tab label="Project" />
                </Tabs>
                <Switch>
                    <Route exact path="/siteSelect" render={routeProps => (
                        <CarpoolSiteSelect
                            {...routeProps} 
                            close={close}
                        />
                    )} />
                    <Route path="/siteSelect/project" render={routeProps => (
                        <ProjectSiteSelect 
                            {...routeProps}
                            close={close}
                        />
                    )}/>
                </Switch>
            </React.Fragment>
        </Dialog>
    );
}