import {useCallback, useEffect, useRef, useState} from 'react';

import './RadioView.scss'
import {Column, Grid} from '../../common';

const radioSrc = 'https://f41.fabricahost.com.br/metrosppop?f=1683712964N01H02HSY27Q40XE3T543RDC16D&amp;tid=01H02HR78PY0NHKTZM3XH1841S'
export const RadioView = () =>
{

    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ songData, setSongData ] = useState<any>({})

    const audioRef = useRef<HTMLAudioElement>(null)

    const handle = async () =>
    {
        if (audioRef.current.paused)
        {
            await audioRef.current.play()
        }
        else
        {
            audioRef.current.pause()
        }
    }

    const fetchData = useCallback(() =>
    {
        fetch('https://m985.com.br/api/last/pop')
            .then(response => response.json())
            .then(data => setSongData(() => data))
            .catch(console.error)
    }, [])

    useEffect(() =>
    {
        fetchData()
        const timer = setInterval(() =>
        {
            fetchData()
        }, 20000)
        return () =>
        {
            clearInterval(timer)
        }
    }, [ fetchData ])

    useEffect(() =>
    {
        if (audioRef.current)
        {
            audioRef.current.addEventListener('play', () =>
            {
                setIsPlaying(true)
            });
            audioRef.current.addEventListener('pause', () =>
            {
                setIsPlaying(false)
            });
        }
    }, [ audioRef ])

    return <>
        <Grid fullHeight={ false } className={ 'radio-view' } gap={ 1 } justifyContent={ 'center' }
              alignItems={ 'center' }
              style={ {backgroundImage: songData?.song?.cover && `url('${ songData?.song?.cover }')`} }>
            <Column size={ 2 } style={ {paddingLeft: '10px'} }>
                { isPlaying && <audio controls={ false } ref={ audioRef } autoPlay={ true }>
                    <source
                        type={ 'audio/aac' }
                        src={ radioSrc }/>
                </audio> }
                <button onClick={ handle }
                        className={ 'radio-button ' + (isPlaying ? 'playing' : '') }/>
            </Column>
            { songData && <Column size={ 10 } style={ {padding: '10px'} }>
                <span><b>{ songData.song?.name }</b></span>
                <span>{ songData.artist?.name }
                    { songData?.feat && <> feat. { songData.feat?.name }</> }
                    </span>
            </Column> }
        </Grid>
    </>
}
