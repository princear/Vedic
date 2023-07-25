import React from 'react';
import { Container, HStack } from 'native-base';
import { StatusBar } from 'react-native';

export default props => (
    <Container>
        <StatusBar translucent />
        <HStack iosBarStyle="light-content">
            {props.headerLeft && props.headerLeft}
            {props.headerBody && props.headerBody}
            {props.headerRight && props.headerRight}
        </HStack>
        { props.children}
    </Container>
);
