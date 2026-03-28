'use client'

const ads = [
  {
    name: 'TechClipsエージェント',
    html: '<a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3766447&pid=892579819" rel="nofollow sponsored"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3766447&pid=892579819" height="1" width="1" border="0">ITエンジニア専門の転職エージェント【TechClipsエージェント】</a>',
    category: 'job',
  },
  {
    name: 'エイジレスエージェント',
    html: '<a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3766447&pid=892579823" rel="nofollow sponsored"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3766447&pid=892579823" height="1" width="1" border="0">40~50代 × SE/PM/ITコンの転職に特化【エイジレス】</a>',
    category: 'job',
  },
  {
    name: 'ABLENET VPS',
    html: '<a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3766447&pid=892579825" rel="nofollow sponsored"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3766447&pid=892579825" height="1" width="1" border="0">ABLENET</a>',
    category: 'vps',
  },
  {
    name: 'ABLENETレンタルサーバー',
    html: '<a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3766447&pid=892579827" rel="nofollow sponsored"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3766447&pid=892579827" height="1" width="1" border="0">ABLENETレンタルサーバー</a>',
    category: 'vps',
  },
]

export default function AdSlot({ variant = 'default' }: { variant?: 'default' | 'inline' }) {
  // 記事ページは2箇所あるので、上段=転職、下段=VPS に分ける
  const adIndex = variant === 'inline' ? Math.floor(Math.random() * ads.length) : null
  const displayAd = adIndex !== null ? ads[adIndex] : null

  // 記事ページ以外: ランダムに1つ表示
  if (displayAd) {
    return (
      <div
        className="ad-slot"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          padding: '1rem 1.5rem',
          margin: '1.5rem 0',
        }}
        dangerouslySetInnerHTML={{ __html: displayAd.html }}
      />
    )
  }

  // デフォルト: 転職広告2つを並べて表示
  const jobAds = ads.filter(a => a.category === 'job')
  const vpsAds = ads.filter(a => a.category === 'vps')
  const allAds = [...jobAds, ...vpsAds]

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {allAds.map(ad => (
          <div
            key={ad.name}
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd',
              borderRadius: 'var(--radius)',
              padding: '1rem 1.25rem',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: ad.html }}
          />
        ))}
      </div>
    </div>
  )
}
