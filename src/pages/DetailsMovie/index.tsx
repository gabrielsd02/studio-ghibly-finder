import {
    useState,
    useEffect,
    memo
} from 'react';
import {
    Center,
    VStack,
    Container,
    Image,
    UnorderedList,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    ListItem,
    Tooltip,
    Heading,
    Text,
    HStack,
    Badge,
    Flex,
    Box
} from "@chakra-ui/react";
import {
    StarIcon,
    ArrowBackIcon
} from '@chakra-ui/icons';
import {
    useParams,
    useNavigate
} from 'react-router-dom';
import axios from 'axios';
import useIsMounted from 'ismounted';

import {
    MoviesProps,
    PeopleProps
} from '../../interfaces';
import {
    TitleMovie,
    BackButton,
    ContainerImage,
    ContainerTexts,
    LabelContainer,
    LabelInformation,
    LabelDescriptionContainer
} from './styles';
import ImageBackground from '../../assets/images/image-background.jpg';
import Loading from '../../components/Loading';

export function DetailsMovie() {

    const navigate = useNavigate();
    const props = useParams();
    const isMounted = useIsMounted();

    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [movieData, setMovieData] = useState({} as MoviesProps);
    const [characters, setCharacters] = useState<PeopleProps[]>([]);

    function verifyColorScore(score: string) {
        
        const scoreInt = parseInt(score);
        let color = '';

        if(scoreInt < 40) {
            color = 'red';
        } else if(scoreInt >= 40 && scoreInt < 70) {
            color = 'yellow';
        } else if(scoreInt >= 70 && scoreInt < 80) {
            color = 'orange';
        } else {
            color = 'green.600';
        }

        return color;

    }

    async function consultMovie() {

        if (!props.id) return navigate(-1);

        if (loading) return;

        setLoading(true);

        const id: string = props.id;

        try {

            const { data }: any = await axios.get(`/films/${id}`);

            if (data.film) setMovieData(data.film);
            if (data.characters && data.characters.length > 0) setCharacters(data.characters);

        } catch (e: any) {
            console.error(e);

            if (axios.isAxiosError(e) && e.response && e.response.data) {

                const error = e.response.data;



            }

        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        consultMovie();
    }, []);    
    
    if (!isMounted.current) return <Loading />
    
    return (<>
        <Center
            bgImage={ImageBackground}
            backgroundSize={"cover"}
            h={"100vh"}
            w={"100vw"}
            pos={"relative"}
            overflowY={'auto'}
            css={{
                '&::-webkit-scrollbar': {
                    width: '12px',
                    height: '10px',
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "5px"
                },
                '&::-webkit-scrollbar-thumb': {
                    height: '70px',
                    background: "gray",
                    borderRadius: '10px',
                }
            }}
        >
            <Flex
                w={"100%"}
                h={"95%"}
                flex={1}
                align={"center"}
                justify={"center"}
                backdropFilter={"blur(5px)"}                                
            >
                {(loading) ?
                    <Loading />
                    : <VStack
                        h={'100%'}
                        w={'100%'}
                        spacing={5}                  
                    >
                        <Box margin={'auto'}>
                            <TitleMovie>
                                {movieData.title || ''}
                            </TitleMovie>
                        </Box>
                        <Center
                            flexGrow={1}
                            w={"60%"}
                            borderRadius={5}
                        >
                            <Card 
                                maxW={'4xl'} 
                                backgroundColor={"rgba(0, 0, 0, 0.7)"}
                                color={"white"}
                                overflow={'auto'}
                                maxH={'100%'}
                                marginBottom={10}
                            >
                                <CardBody                                    
                                    borderRadius={5}
                                    overflowX={"hidden"}
                                    overflowY={"auto"}
                                    p={5}                                    
                                >
                                    <Image
                                        alt={'Image Movie Banner'}
                                        boxSize={'100%'}
                                        src={movieData.movieBanner}
                                        borderRadius={5}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    {!imageLoaded && <Loading message={'Loading image...'} />}
                                    <HStack 
                                        w={'100%'} 
                                        h={'50px'}
                                        align={'center'} 
                                        justify={'space-between'}
                                        mt={3}
                                    >
                                        <HStack
                                            flex={1}
                                            spacing={3}
                                        >               
                                            <Text 
                                                fontSize={'24px'}
                                                border={'1px solid white'}
                                                borderRadius={5}
                                                background={verifyColorScore(movieData.rtScore)}
                                                px={3}
                                                py={1.5}
                                            >
                                                {movieData.rtScore || ''}                                            
                                            </Text>        
                                            <StarIcon
                                                color={'yellow'}
                                                fontSize={'4xl'}
                                                mb={1}
                                            />                                                             
                                        </HStack>
                                        <HStack 
                                            fontSize={'16px'}
                                            align={'flex-start'}
                                            h={'100%'}
                                        >
                                            <Badge 
                                                variant={'solid'} 
                                                colorScheme={'twitter'}
                                                fontSize={'100%'}
                                            >
                                                {movieData.releaseDate || ''}
                                            </Badge>
                                            <Badge 
                                                variant={'solid'}
                                                colorScheme={'teal'}
                                                fontSize={'100%'}
                                            >
                                                {movieData.runningTime || ''} min
                                            </Badge>                                            
                                        </HStack>                                                                                
                                    </HStack>
                                    <VStack mt={6} spacing={3}>
                                        <Heading 
                                            size={'lg'} 
                                            w={'100%'} 
                                            fontFamily={'cursive'}
                                            textAlign={'left'}
                                            textDecoration={'underline'}
                                        >
                                            Description
                                        </Heading>
                                        <Text 
                                            textAlign={'left'}
                                            fontSize={'16px'}
                                        >
                                            {movieData.description || ''}
                                        </Text>
                                    </VStack>
                                    {(characters.length > 0) && <VStack mt={6} spacing={3}>
                                        <Heading 
                                            size={'lg'} 
                                            w={'100%'} 
                                            fontFamily={'cursive'}
                                            textAlign={'left'}
                                            textDecoration={'underline'}
                                        >
                                            Characters:
                                        </Heading>
                                        <UnorderedList 
                                            spacing={3}
                                            w={'90%'}
                                            textAlign={'left'}
                                        >
                                            {characters.map((character, index) => (
                                                <ListItem key={index} ml={5} mt={2}>
                                                    {character.name}
                                                </ListItem>
                                            ))}
                                        </UnorderedList>
                                    </VStack>}
                                </CardBody>
                            </Card>
                        </Center>
                    </VStack>}
            </Flex>
        </Center>
        <Tooltip
            label={"Back to home"}
            fontSize={"md"}
            hasArrow
            placement='top'
        >
            <BackButton
                onClick={() => navigate('/')}
                _hover={{
                    opacity: 0.7
                }}
            >
                <ArrowBackIcon
                    fontSize={'5xl'}
                    color={'white'}
                />
            </BackButton>
        </Tooltip>
    </>)

}

export default memo(DetailsMovie);
