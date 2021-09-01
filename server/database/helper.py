
from flask import session

def findMatchingUser(country, region, dic,foundUser):
    for user in range(len(dic)):
        if country and region in dic[user].values():
            foundUser[0] = dic[user]['username']
            break



def deleteFoundUser(foundUser, dic):
  for user in range(len(dic)):
    if foundUser.lower() == dic[user]['username'].lower():
      del dic[user]
      break
   

def trackRoom(foundUser, dic, room):
    for user in range(len(dic)):
        if foundUser in dic[user].values():
            dic[user].update({"room":room})