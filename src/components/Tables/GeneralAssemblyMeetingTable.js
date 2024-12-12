import React from "react";

export const GeneralAssemblyMeetingTable = ({ listItem }) => {
    return (
        <div className='events-list'>
            <h3>General Assembly Meeting</h3>
            <table>
                <thead>
                    <tr>
                        <th>Type of Assembly</th>
                        <th>AGM Date</th>
                        <th>Holding Site</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='single-event'>
                        <td>{
                            listItem['v_corporate_actions.gam_type_of_assembly'] ? listItem['v_corporate_actions.gam_type_of_assembly'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.gam_agm_date'] ? listItem['v_corporate_actions.gam_agm_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.gam_holding_site'] ? listItem['v_corporate_actions.gam_holding_site'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.gam_status'] ? listItem['v_corporate_actions.gam_status'] : '-'
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}