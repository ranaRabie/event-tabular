import React, { useEffect, useState } from "react";

export const AnnouncementTable = ({ listItem }) => {
    const [parsedData, setParsedData] = useState([]);

    useEffect(() => {
        const data = [];
        
        // Parse the HTML string using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(listItem['v_corporate_actions.announcement_details'], 'text/html');
        
        // Replace all img elements with new url
        let imgTags = doc.getElementsByTagName("img");
        for (let img of imgTags) {
            if (img) {
                let currentSrc = img.src;
                currentSrc = currentSrc.split('/').splice(3).join('/');
                
                img.src = 'https://www.saudiexchange.sa/'+currentSrc;
            }
        }

        // Replace all Href elements with new url
        let hrefTags = doc.getElementsByTagName("a");
        for (let href of hrefTags) {
            if (href) {
                let currentHref = href.href;
                currentHref = currentHref.split('/').splice(3).join('/');
                
                href.href = 'https://www.saudiexchange.sa/'+currentHref;
            }
        }

        // Get the updated HTML string
        const updatedHtml = doc.body.innerHTML;
        data.push({
            "v_corporate_actions.action_type": listItem["v_corporate_actions.action_type"],
            "v_corporate_actions.announcement_details": updatedHtml
        });


        setParsedData(data);
    }, [listItem]);


    return (
        <div className='events-list'>
            {parsedData && parsedData.map((dataItem, idx) => (
                <>
                    <h3>{dataItem['v_corporate_actions.action_type']}</h3>
                    <div key={idx} dangerouslySetInnerHTML={{ __html: dataItem["v_corporate_actions.announcement_details"] }} />
                </>
            ))}
        </div>
    )
} 