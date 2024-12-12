import React from "react";

export const OtherTable = ({ listItem }) => {
    return (
        <div className='events-list'>
            <h3>Other Corporate Actions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Recommendation Announcement Date</th>
                        <th>Eligibility Date</th>
                        <th>New Capital</th>
                        <th>Previous Capital</th>
                        <th>New Issued Shares</th>
                        <th>Previous Issued Shares</th>
                        <th>Close Price</th>
                        <th>Adjusted Close Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='single-event'>
                        <td>{
                            listItem['v_corporate_actions.recommendation_announcement_date'] ? listItem['v_corporate_actions.recommendation_announcement_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.eligibility_date'] ? listItem['v_corporate_actions.eligibility_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.new_capital'] ? listItem['v_corporate_actions.new_capital'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.previous_capital'] ? listItem['v_corporate_actions.previous_capital'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.new_issued_shares'] ? listItem['v_corporate_actions.new_issued_shares'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.previous_issued_shares'] ? listItem['v_corporate_actions.previous_issued_shares'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.close_price'] ? listItem['v_corporate_actions.close_price'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.adjusted_close_price'] ? listItem['v_corporate_actions.adjusted_close_price'] : '-'
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}