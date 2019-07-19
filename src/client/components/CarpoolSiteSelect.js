import React from "react";
import loglevel from 'loglevel';
import { withRouter } from 'react-router-dom';

import sitcAirtable from "./../api/sitcAirtable";
import SiteSelect from "./SiteSelect";

export default function CarpoolSiteSelect (props) {
  loglevel.info("mounting a CarpoolSiteSelect");
  return (
    <SiteSelect
      {...props}
      type="carpool"
      getSites={sitcAirtable.getCarpoolSites}
      localStorageItemId="defaultCarpoolSiteId"
      routeUrl="/"
    />
  )
}
