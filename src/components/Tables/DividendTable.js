import React from "react";

export const DividendTable = ({ listItem }) => {
    return (
        <div className='events-list'>
            <h3>Dividend</h3>
            <table>
                <thead>
                    <tr>
                        <th>Announcement date</th>
                        <th>Eligibility Date</th>
                        <th>Distribution Method</th>
                        <th>Distribution Amount</th>
                        <th>EX Date</th>
                        <th>Period</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='single-event'>
                        <td>{
                            listItem['v_corporate_actions.dividends_announcement_date'] ? listItem['v_corporate_actions.dividends_announcement_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.dividends_eligibility_date'] ? listItem['v_corporate_actions.dividends_eligibility_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.dividends_distribution_method'] ? listItem['v_corporate_actions.dividends_distribution_method'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.dividends_distribution_amount'] ? listItem['v_corporate_actions.dividends_distribution_amount'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.dividends_ex_date'] ? listItem['v_corporate_actions.dividends_ex_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.period'] ? listItem['v_corporate_actions.period'] : '-'
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}