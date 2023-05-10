import { useEffect, useState } from 'react';
import { Flex, Select, Box, Text, Input, Spinner, Icon, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';

import { filterData, getFilterValues } from '../utils/filterData';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg';

export default function SearchFilters() {

  const [filters] = useState(filterData);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationData, setLocationData] = useState([]);

  const [showLocations, setShowLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(router);


  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;

    // Saving The Values In An Objet Every Time I Click On Select And Choose Different Value.. By Usign Const And Fun getFliterValues()...Then Use That Nes Const To Use It's New Values To Change The Values Of Query Which In The URL To Change The Request To Get Different Reposnses
    const values = getFilterValues(filterValues);

    values.forEach((item) => {
      // That Condition Is To Only Show The Changes In Query Values On The URL Not ALL These Empty Ones .. So We Check If The Item.value,item.name of FilteredValues Are Values...
      if (item.value && filterValues?.[item.name]) {
        query[item.name] = item.value;
      }
    })

    // Confirming URL Query And Path After We Modified On Itself .. ( By Using forEach For Values We Stored After Finishing The Selection Process And Edit The URL Query Values Above ) ...
    router.push({ pathname: path, query: query });
  };

  useEffect(() => {

    if (searchTerm !== '') {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);
        setLoading(false);
        setLocationData(data?.hits);
      };

      fetchData();
    }
  }, [searchTerm]);

  return (
    <Flex bg='gray.100' p='4' justifyContent='center' flexWrap='wrap'>

      {filters?.map((filter) => (
        <Box key={filter.queryName}>
          <Select
            // [filter.queyName] Is A Dynamic Props So We Destrucure It By Brackets Method...
            onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
            // We Used The onChange() Here Because Resualts Change By Chaning Any Value Of Them ..
            placeholder={filter.placeholder}
            w='fit-content'
            p='2' >

            {filter?.items?.map((item) => (
              <option value={item.value} key={item.value}>
                {item.name}
              </option>
            ))}

          </Select>
        </Box>
      ))}

      {/*Search Button*/}
      <Flex flexDir='column'>
        <Button onClick={() => setShowLocations(!showLocations)} border='1px' borderColor='gray.200' marginTop='2' >
          Search Location
        </Button>

        {showLocations && (
          <Flex flexDir='column' pos='relative' paddingTop='2'>
            <Input
              placeholder='Type Here'
              value={searchTerm}
              w='300px'
              focusBorderColor='gray.300'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm !== '' && (
              <Icon
                as={MdCancel}
                pos='absolute'
                cursor='pointer'
                right='5'
                top='5'
                zIndex='100'
                onClick={() => setSearchTerm('')}
              />
            )}

            {loading && <Spinner margin='auto' marginTop='3' />}

            {showLocations && (
              <Box height='300px' overflow='auto'>
                {
                  locationData?.map((location) => (
                    <Box
                      key={location.id}
                      onClick={() => {
                        // Here We Have To Call The Function Which Manage Us To Modify The filterValues Which Is Called In searchProperties Which Is Callign Also Fun getFilterValues() Which Accepts An Object As A Parameter And Here It Will Be The Resualt Select And Click Which Is Carring The New Property locationExternalIDs( backing to getFilterValues() ) ... Then That Function Goes Easly(But It Re-show The Same data causeof the router properties we use It May Be A Bug Here !).. Then useEffect() Makes  Rerendering To Fetch The New Data...
                        searchProperties({ locationExternalIDs: location.externalID });
                        setShowLocations(false);
                        setSearchTerm(location.name);
                      }}
                    >
                      <Text cursor='pointer' bg='gray.200' p='2' borderBottom='1px' borderColor='gray.100' >
                        {location.name}
                      </Text>
                    </Box>
                  ))}
                {!loading && !locationData?.length && (
                  <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5' >
                    <Image src={noresult} />
                    <Text fontSize='xl' marginTop='3'>
                      Waiting to search!
                    </Text>
                  </Flex>
                )}
              </Box>
            )}
          </Flex>
        )}

      </Flex>
    </Flex>
  );
}
