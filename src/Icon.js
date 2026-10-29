import React from 'react';
import {
  MapPin, Star, Gem, CloudSun, Sun, CloudRain, CloudLightning, CloudDrizzle, Snowflake,
  Phone, Map as MapIcon, Volume2, BedDouble, Drama, Compass, Mail, Bot, Check, Car,
  CircleCheck, Utensils, Calendar, Globe, Lock, Glasses, ShoppingCart, Hourglass,
  ArrowLeftRight, Ticket, Telescope, Hotel, Wallet, Hand, ClipboardList, TriangleAlert,
  Lightbulb, Maximize2, Ban, Flame, Package, Link as LinkIcon, Search, Droplets, Wind,
  Sparkles, Crown, Mountain, Leaf, Zap, PawPrint, Bus, Earth, Send, Sprout, Camera,
  Heart, House, Scale, Building2, X, Ellipsis, ArrowLeft, ArrowRight,
} from 'lucide-react';

// emoji / symbol  ->  [icon component, optional colour, filled?]
const MAP = {
  '📍': [MapPin], '⭐': [Star, '#e8b93a', true], '💎': [Gem], '⛅': [CloudSun],
  '☀️': [Sun], '🌤️': [CloudSun], '🌧️': [CloudRain], '🌩️': [CloudLightning],
  '🌦️': [CloudDrizzle], '❄️': [Snowflake], '📞': [Phone], '🗺️': [MapIcon],
  '🔊': [Volume2], '🛏️': [BedDouble], '🎭': [Drama], '🧭': [Compass], '✉️': [Mail],
  '🤖': [Bot], '✓': [Check], '🚗': [Car], '✅': [CircleCheck, '#5dcaa5'],
  '🍽️': [Utensils], '🍽': [Utensils], '📅': [Calendar], '🗓': [Calendar], '🌐': [Globe],
  '🔐': [Lock], '🔒': [Lock], '🥽': [Glasses], '🛒': [ShoppingCart], '⏳': [Hourglass],
  '💱': [ArrowLeftRight], '🎟️': [Ticket], '🔭': [Telescope], '🏨': [Hotel],
  '💰': [Wallet], '👋': [Hand], '📋': [ClipboardList], '⚠️': [TriangleAlert],
  '💡': [Lightbulb], '⛶': [Maximize2], '🚫': [Ban, '#e24b4a'], '🔥': [Flame],
  '🥡': [Package], '🔗': [LinkIcon], '🔍': [Search], '💧': [Droplets], '💨': [Wind],
  '✨': [Sparkles], '👑': [Crown], '🏔️': [Mountain], '🌿': [Leaf], '⚡': [Zap],
  '🦁': [PawPrint], '🚌': [Bus], '🌍': [Earth], '➤': [Send], '🌱': [Sprout],
  '📷': [Camera], '❤️': [Heart, '#e24b4a', true], '🏠': [House], '⚖️': [Scale],
  '🏢': [Building2], '✕': [X], '⋯': [Ellipsis], '←': [ArrowLeft], '→': [ArrowRight],
};

// ignore the invisible emoji variation selector so '☀️' and '☀' both match
const norm = (x) => (x || '').replace(/\uFE0F/g, '');
const NMAP = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [norm(k), v]));

/**
 * <I e="📍" />  – renders the Lucide icon that replaces that emoji.
 * Size defaults to 1.15em so it scales with the surrounding font-size,
 * and the colour is inherited from the parent (currentColor).
 */
export function I({ e, size = '1.15em', color, strokeWidth = 1.75, style }) {
  e = norm(e);
  if (e === '🟢') {
    return (
      <span aria-hidden="true" style={{
        display: 'inline-block', width: '0.6em', height: '0.6em', borderRadius: '50%',
        background: color || '#5dcaa5', marginRight: 2, verticalAlign: '0.05em', ...style,
      }} />
    );
  }
  const entry = NMAP[e];
  if (!entry) return <span>{e}</span>; // unknown symbol: fall back to the text itself
  const [Cmp, defColor, filled] = entry;
  const c = color || defColor;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      color={c || 'currentColor'}
      fill={filled ? (c || 'currentColor') : 'none'}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: '-0.2em', flexShrink: 0, ...style }}
    />
  );
}

/** Star rating. Pass a string like '★★★☆☆' (hotel class) or a number. */
export function Stars({ s, n, size = '1em' }) {
  const total = n != null ? 5 : (s || '').length;
  const filled = n != null ? n : ((s || '').match(/★/g) || []).length;
  return (
    <span style={{ display: 'inline-flex', gap: 1, verticalAlign: 'middle' }} aria-label={`${filled} stars`}>
      {Array.from({ length: n != null ? filled : total }).map((_, i) => (
        <Star key={i} size={size} strokeWidth={1.5} color="#e8b93a"
          fill={i < filled ? '#e8b93a' : 'none'} style={{ opacity: i < filled ? 1 : 0.45 }} />
      ))}
    </span>
  );
}
