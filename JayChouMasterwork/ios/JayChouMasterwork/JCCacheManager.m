//
//  JCCacheManager.m
//  JayChouMasterwork
//
//  Created by Jazys on 7/13/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "JCCacheManager.h"
#import <RCTLog.h>

static NSString *JCCacheManagerObjectKey = @"JCCacheManagerObjectKey";

@implementation JCCacheManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setCache:(NSArray *)cache) {
  [[NSUserDefaults standardUserDefaults] setObject:cache forKey:JCCacheManagerObjectKey];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

RCT_EXPORT_METHOD(cache:(RCTResponseSenderBlock)callback) {
  id cacheObject = [[NSUserDefaults standardUserDefaults] objectForKey:JCCacheManagerObjectKey];
  NSMutableArray *callbackArray = [NSMutableArray array];
  if (cacheObject) {
    [callbackArray addObject:cacheObject];
  }
  callback(@[callbackArray]);
}

@end
