'use client'

import React from 'react'
import {
  chakra,
  shouldForwardProp,
  ChakraProps,
  HTMLChakraProps,
} from '@chakra-ui/react'
import { isValidMotionProp, motion, HTMLMotionProps } from 'framer-motion'

export interface MotionBoxProps
  extends Omit<HTMLMotionProps<'div'>, 'transition' | 'color'>,
    ChakraProps {}

export const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})
