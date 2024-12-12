import React from "react";

export const IPOTable = ({ listItem }) => {
    return (
        <div className='events-list'>
            <h3>IPO</h3>
            <table>
                <thead>
                    <tr>
                        <th>IPO Market</th>
                        <th>IPO Offerring Size</th>
                        <th>IPO Offerring Price</th>
                        <th>IPO Offerring Date</th>
                        <th>IPO Closing Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='single-event'>
                        <td>{
                            listItem['v_corporate_actions.ipo_market'] ? listItem['v_corporate_actions.ipo_market'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.ipo_offering_size'] ? listItem['v_corporate_actions.ipo_offering_size'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.ipo_offering_price'] ? listItem['v_corporate_actions.ipo_offering_price'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.ipo_offering_date'] ? listItem['v_corporate_actions.ipo_offering_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.ipo_closing_date'] ? listItem['v_corporate_actions.ipo_closing_date'] : '-'
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}