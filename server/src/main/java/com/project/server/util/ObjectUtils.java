package com.project.server.util;

import java.beans.FeatureDescriptor;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.BeanUtils;

public class ObjectUtils {
    /**
     * Get the names of properties that are null in the source object.
     *
     * @param source the source object
     * @return an array of property names that are null
     */
    public static String[] getNullPropertyNames(Object source, String... excludeFields) {
        Set<String> excludeSet = new HashSet<>(Arrays.asList(excludeFields));

        return Arrays.stream(BeanUtils.getPropertyDescriptors(source.getClass()))
                .filter(descriptor -> {
                    String name = descriptor.getName();
                    if ("class".equals(name) || excludeSet.contains(name)) {
                        return false;
                    }
                    try {
                        Method readMethod = descriptor.getReadMethod();
                        if (readMethod != null) {
                            Object value = readMethod.invoke(source);
                            return value == null;
                        }
                    } catch (Exception e) {
                        return false;
                    }
                    return false;
                })
                .map(FeatureDescriptor::getName)
                .toArray(String[]::new);
    }
}
