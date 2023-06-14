
import { Card, Text } from "@nextui-org/react";


const Cards = ({w, hb, ht, bb, bt, topic, message}) => {
    return (
        <Card css={{ mw: w+"px" }}>
        <Card.Header css={{ backgroundColor: hb }}>
            <Text b css={{ color: ht }}>{topic}</Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body css={{ backgroundColor: bb }}>
            <Text css={{ color: bt }}>{message}</Text>
        </Card.Body>
        </Card>
    );
};

export const CardWarning = ({topic, message}) => {
    return (
        <Cards w='500' hb='brown' ht='white' bb='white' bt='black' topic={topic} message={message} />
    );
};

export const CardMessage = ({topic, message}) => {
    return (
        <Cards w='500' hb='$accents1' ht='#444444' bb='white' bt='black' topic={topic} message={message} />
    );
};

