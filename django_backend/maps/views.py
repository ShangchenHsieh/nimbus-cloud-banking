import json
from django.http import JsonResponse

from django.shortcuts import render

# APIView class. Has built in HTTP methods(get(), post(), put()). Our MapsView extends from this
# Doc link: https://www.django-rest-framework.org/api-guide/views/
from rest_framework.views import APIView

# AllowAny permissions class. Grants access of the View it is associated with to any user(no authentication required)
# Doc link: https://www.django-rest-framework.org/api-guide/permissions/
from rest_framework.permissions import AllowAny

import os
from dotenv import load_dotenv
import googlemaps as gm

class MapsView(APIView):
    permission_classes = [AllowAny]
    load_dotenv()
    API_KEY = os.getenv('MAPS_API_KEY')
    gmaps = gm.Client(key=API_KEY)
    # starting_address = "San Jose State University"


    def get_lat_lng(self, starting_address):
        """
        Returns the starting address's latitude and longitude as a tuple

        Args:
            starting_address (String)

        Returns:
            tuple: latitude, longitude
        """
        geocode_res = self.gmaps.geocode(starting_address)
        if geocode_res:
            loc = geocode_res[0]['geometry']['location']
            lat_lng = (loc['lat'], loc['lng'])
        else:
            print("Error: could not produce latitude & longitude for the address")
            return None
        return lat_lng 

    def get_nearby_ATMs(self, location, mile_radius):
        """
        Searches for Chase ATMs nearby the location in the given radius

        Args:
            location (lng, lat): starting location coordinates
            mile_radius (int, float): radius in miles

        Returns:
            dictionary: list of places found
        """
        if location is None:
            return []
        
        meters = mile_radius * 1609
        ATMs_nearby = self.gmaps.places_nearby(
            location=location, 
            radius=meters,
            keyword="Chase ATM"
        )
        ATM_results = []
        for result in ATMs_nearby['results']:
            # print(f"Place Id: {result['place_id']}, Name: {result['name']}, Address: {result['vicinity']}")
            atm_info = {
                'place_id': result['place_id'],
                'name': result['name'],
                'address': result['vicinity']
            }
            ATM_results.append(atm_info)
            
        return ATM_results

    def post(self, request):
        """
            Submits the starting address and finds all Chase ATMs nearby
        """

        if request.method == 'POST':
            data = json.loads(request.body)
            starting_address = data.get('address')

            if starting_address:
                location = self.get_lat_lng(starting_address)
                if location:
                    nearby_ATMs = self.get_nearby_ATMs(location, 5)
                    for result in nearby_ATMs:
                        print(result)
                    return JsonResponse({'message': 'Address received', 'ATMs': nearby_ATMs})
                else: 
                    return JsonResponse({'error': 'Could not geocode the address'})
            else:
                return JsonResponse({'error': 'Could not get starting address'})











