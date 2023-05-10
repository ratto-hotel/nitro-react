import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';

export const TwitchView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'twitch/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="twitch" className="nitro-twitch" style={ { width: GetConfiguration('twitch.headers') ? '710px' : '' } }>
                    <NitroCardHeaderView headerText={ LocalizeText('twitch.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView>
                        <iframe
                            src="https://player.twitch.tv/?channel=branca&parent=www.rattohotel.com&allowfullscreen=false&autoplay=true"
                            height="100%"
                            width="100%"
                            allowFullScreen>
                        </iframe>
                    </NitroCardContentView>
                </NitroCardView> }
        </>
    );
}
