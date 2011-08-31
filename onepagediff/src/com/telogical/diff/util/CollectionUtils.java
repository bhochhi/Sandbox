package com.telogical.diff.util;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

public class CollectionUtils {

  public CollectionUtils() {

  }

  public static int size(Collection col) {
    return (col != null) ? col.size() : 0;
  }

  public static int size(Map map) {
    return (map != null) ? map.size() : 0;
  }

  public static Iterator iterable(Object object) {
    if (object instanceof Collection) {
      return ((Collection)object).iterator();
    }
    else if (object instanceof Map) {
      return ((Map)object).keySet().iterator();
    }
    else if (ArrayUtils.isArray(object)) {
      return ArrayUtils.toList(object).iterator();
    }
    else {
      return ArrayUtils.toList(new Object[]{object}).iterator();
    }
  }
  
  public static boolean contains(Collection col, Object obj) {
    return ((obj != null && col != null) ? col.contains(obj) : false);
  }
}
