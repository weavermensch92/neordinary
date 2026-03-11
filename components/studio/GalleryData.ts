const GCP_BASE_URL = 'https://storage.googleapis.com/neordinarysquared';

export interface Project {
    id: string;
    name: string;
    subtitle: string;
    services: string[];
    imageUrl: string;
    description: string;
}

export const PROJECTS: Project[] = [
    {
        id: '(1)',
        name: 'SpoonOS x \n NE(O)RDINARY HACKATHON',
        subtitle: 'IMPACT ON HEALTH',
        services: ['Branding', 'Art Direction', 'Digital product UI (app & web)'],
        imageUrl: `${GCP_BASE_URL}/scoopos/poster.jpg`,
        description: "SpoonOS와 NE(O)RDINARY가 함께한 대규모 해커톤 및 페스티벌입니다. 크리에이티브한 인재들이 모여 건강의 가치를 혁신하는 프로젝트들을 선보였으며, 기획부터 브랜딩, 데모데이까지 전 과정을 아우르는 임팩트를 창출했습니다."
    },
    {
        id: '(2)',
        name: 'AI HACKATHON',
        subtitle: 'INNOVATION IN AI ERA',
        services: ['AI Simulation', 'Interface Design', 'Technical Strategy'],
        imageUrl: `${GCP_BASE_URL}/ai-hackathon/IMG_7871.JPG`,
        description: "인공지능 기술을 기반으로 문제를 해결하고 새로운 가능성을 탐구하는 AI 해커톤입니다. 참가자들은 최신 AI 기술을 접목하여 실무적인 솔루션을 제안하고 프로토타입을 구현하는 혁신적인 시간을 가졌습니다."
    },
    {
        id: '(3)',
        name: 'NE(O)RDINARY DEMODAY',
        subtitle: 'SHOWCASING THE FUTURE',
        services: ['Pitch Deck', 'Event Branding', 'Booth Design', 'Networking'],
        imageUrl: `${GCP_BASE_URL}/festival/IMG_8596.JPG`,
        description: "해커톤을 통해 탄생한 아이디어들이 실제 비즈니스 모델로 성장하는 무대, 너디너리 데모데이입니다. 투자자와 업계 전문가들 앞에서 창의적인 결과물을 발표하고 네트워크를 확장하는 축제가 진행되었습니다."
    },
    {
        id: '(4)',
        name: 'CREATIVE FESTIVAL',
        subtitle: 'CELEBRATION OF BUILDERS',
        services: ['Experience Design', 'Identity Systems', 'Social Media'],
        imageUrl: `${GCP_BASE_URL}/festival/74B840FF-58FF-4472-94FF-CBC826AECB98_1_105_c.jpg`,
        description: "빌더들의 열정과 창의성을 기리는 축제, 페스티벌 세션입니다. 단순한 경쟁을 넘어 지식 공유와 즐거움이 공존하는 공간으로, 다양한 공연과 네트워킹을 통해 새로운 커뮤니티 시너지를 창출했습니다."
    },
    {
        id: '(5)',
        name: '2023 NE(O)RDINARY \n DEMODAY',
        subtitle: 'SHOWCASING THE FUTURE',
        services: ['Event Branding', 'Booth Design', 'Networking', 'Video Archive'],
        imageUrl: `${GCP_BASE_URL}/demoday/20230908_A_0001.MP4`,
        description: "2023년 성수에서 진행된 너디너리 해커톤의 대미를 장식한 데모데이 현장입니다. 수많은 팀들이 만들어낸 열정의 기록들과 그 안에서 일구어낸 성장 스토리들을 압축된 영상 기록으로 확인하실 수 있습니다."
    }
];

export const getSafeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return encodeURI(url.normalize('NFC'));
    return url;
};

export const getThumbnailUrl = (url: string) => {
    if (!url) return '';
    if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov')) {
        const parts = url.split('/');
        const fileName = parts.pop() || '';
        const folder = parts.pop() || '';
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
        return `${GCP_BASE_URL}/thumbnails/${folder}/${nameWithoutExt}.jpg`;
    }
    return url;
};

export const fetchProjectImages = async (projectId: string): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (projectId === '(1)') {
                resolve([
                    `${GCP_BASE_URL}/scoopos/hackathon.mp4`,
                    `${GCP_BASE_URL}/scoopos/poster.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7112.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7113.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7124.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7125.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4465.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4479.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4568.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4571.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4767.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4927.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8477.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8510.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8612.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8744.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8771.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8780.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8799.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8821.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8824.jpg`
                ]);
            } else if (projectId === '(2)') {
                resolve([
                    `${GCP_BASE_URL}/scoopos/hackathon.mp4`,
                    `${GCP_BASE_URL}/scoopos/poster.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7112.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7113.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7124.jpg`,
                    `${GCP_BASE_URL}/drive-download-20260225T055615Z-1-001/IMG_7125.jpg`,
                    `${GCP_BASE_URL}/ai-hackathon/20251123_124508.jpg`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1869.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1877.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1881.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1897.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_3204.jpg`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_7871.JPG`,
                    `${GCP_BASE_URL}/hackathon/0N8A3414.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3418.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3445.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3469.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3502.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3543.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3587.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4465.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4479.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4568.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4571.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4767.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4927.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8477.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8510.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8612.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8744.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8771.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8780.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8799.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8821.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8824.jpg`
                ]);
            } else if (projectId === '(4)') {
                resolve([
                    `${GCP_BASE_URL}/festival/36815A22-7F40-4445-B1BB-209C9E53D20F_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/74B840FF-58FF-4472-94FF-CBC826AECB98_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/9755B5E1-A0B7-4541-BD7C-CD80908CF501_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/B3D42243-C69F-443E-ACE0-90FC3ACB6F57_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/IMG_8596.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8597.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8602.JPG`
                ]);
            } else if (projectId === '(5)') {
                resolve([
                    `${GCP_BASE_URL}/demoday/20230908_A_0001.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0020.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0041.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0052.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0076.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0078.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0079.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0102.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0112.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0113.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0131.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0158.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_B_0147.MP4`,
                    `${GCP_BASE_URL}/festival/36815A22-7F40-4445-B1BB-209C9E53D20F_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/74B840FF-58FF-4472-94FF-CBC826AECB98_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/9755B5E1-A0B7-4541-BD7C-CD80908CF501_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/B3D42243-C69F-443E-ACE0-90FC3ACB6F57_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/IMG_8596.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8597.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8602.JPG`
                ]);
            } else {
                resolve([
                    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1558655146-d09347e0b7a8?auto=format&fit=crop&q=80&w=800"
                ]);
            }
        }, 500);
    });
};
